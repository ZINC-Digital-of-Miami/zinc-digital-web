// Vision helper for scripts/prepare-team-photos.mjs (quick task 260926-6g7,
// "team" sub-task). Two subcommands, both read-only against the source
// image and write only the requested output:
//
//   swift prepare-team-photos.swift landmarks <imagePath>
//     -> JSON {width,height,face:{x,y,w,h},leftEye:{x,y},rightEye:{x,y}}
//        for the largest detected face, pixel coords, origin top-left.
//        Exits 1 with {"error":"no-face"} if VNDetectFaceLandmarksRequest
//        finds nothing (caller must handle — never fabricate a face).
//
//   swift prepare-team-photos.swift mask <imagePath> <outputPngPath>
//     -> writes an 8-bit grayscale PNG (same pixel size as the input) from
//        VNGeneratePersonSegmentationRequest — 255 = person, 0 = background.
//        This is a real per-pixel Vision inference result, not a synthesized
//        cutout; feathering/compositing happens downstream in sharp.
//
// Run via the `swift` interpreter (no separate compile step) — invoked a
// handful of times per photo, so interpreter startup cost is acceptable.

import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers

func fail(_ message: String) -> Never {
    FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
    exit(1)
}

func imageSize(of url: URL) -> (Int, Int)? {
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil),
          let props = CGImageSourceCopyPropertiesAtIndex(src, 0, nil) as? [CFString: Any],
          let w = props[kCGImagePropertyPixelWidth] as? Int,
          let h = props[kCGImagePropertyPixelHeight] as? Int else { return nil }
    return (w, h)
}

let args = CommandLine.arguments
guard args.count >= 3 else {
    fail("usage: prepare-team-photos.swift landmarks <path> | mask <path> <outPath>")
}
let command = args[1]
let inputPath = args[2]
let inputURL = URL(fileURLWithPath: inputPath)

switch command {
case "landmarks":
    guard let (width, height) = imageSize(of: inputURL) else { fail("could not read image dimensions") }
    let handler = VNImageRequestHandler(url: inputURL, options: [:])
    let request = VNDetectFaceLandmarksRequest()
    do { try handler.perform([request]) } catch { fail("vision request failed: \(error)") }
    guard let observations = request.results, !observations.isEmpty else {
        print("{\"error\":\"no-face\",\"width\":\(width),\"height\":\(height)}")
        exit(1)
    }
    // Largest face by normalized bounding-box area.
    let face = observations.max(by: { $0.boundingBox.width * $0.boundingBox.height < $1.boundingBox.width * $1.boundingBox.height })!
    let bb = face.boundingBox // normalized, origin bottom-left

    func imagePoint(_ p: CGPoint) -> (Double, Double) {
        // p is normalized within the face bounding box, origin bottom-left.
        let nx = bb.origin.x + p.x * bb.size.width
        let ny = bb.origin.y + p.y * bb.size.height
        let px = Double(nx) * Double(width)
        let py = (1.0 - Double(ny)) * Double(height) // flip to top-left origin
        return (px, py)
    }

    func centroid(_ region: VNFaceLandmarkRegion2D?) -> (Double, Double)? {
        guard let region = region, region.pointCount > 0 else { return nil }
        var sx = 0.0, sy = 0.0
        for p in region.normalizedPoints {
            let (x, y) = imagePoint(p)
            sx += x; sy += y
        }
        let n = Double(region.pointCount)
        return (sx / n, sy / n)
    }

    let faceX = Double(bb.origin.x) * Double(width)
    let faceW = Double(bb.size.width) * Double(width)
    let faceYTop = (1.0 - Double(bb.origin.y) - Double(bb.size.height)) * Double(height)
    let faceH = Double(bb.size.height) * Double(height)

    var out = "{\"width\":\(width),\"height\":\(height),"
    out += "\"face\":{\"x\":\(faceX),\"y\":\(faceYTop),\"w\":\(faceW),\"h\":\(faceH)}"
    if let (lx, ly) = centroid(face.landmarks?.leftEye) {
        out += ",\"leftEye\":{\"x\":\(lx),\"y\":\(ly)}"
    }
    if let (rx, ry) = centroid(face.landmarks?.rightEye) {
        out += ",\"rightEye\":{\"x\":\(rx),\"y\":\(ry)}"
    }
    out += ",\"roll\":\(face.roll?.doubleValue ?? 0),\"yaw\":\(face.yaw?.doubleValue ?? 0)"
    out += "}"
    print(out)

case "mask":
    guard args.count >= 4 else { fail("mask requires an output path") }
    let outputPath = args[3]
    guard let (width, height) = imageSize(of: inputURL) else { fail("could not read image dimensions") }
    let handler = VNImageRequestHandler(url: inputURL, options: [:])
    let request = VNGeneratePersonSegmentationRequest()
    request.qualityLevel = .accurate
    request.outputPixelFormat = kCVPixelFormatType_OneComponent8
    do { try handler.perform([request]) } catch { fail("vision segmentation failed: \(error)") }
    guard let result = request.results?.first else { fail("no segmentation result") }
    let ciImage = CIImage(cvPixelBuffer: result.pixelBuffer)
    let scaleX = CGFloat(width) / ciImage.extent.width
    let scaleY = CGFloat(height) / ciImage.extent.height
    let scaled = ciImage.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))
    let context = CIContext()
    guard let cgImage = context.createCGImage(scaled, from: CGRect(x: 0, y: 0, width: width, height: height)) else {
        fail("could not render mask")
    }
    guard let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: outputPath) as CFURL, UTType.png.identifier as CFString, 1, nil) else {
        fail("could not open mask output")
    }
    CGImageDestinationAddImage(dest, cgImage, nil)
    if !CGImageDestinationFinalize(dest) { fail("could not write mask PNG") }
    print("{\"written\":\"\(outputPath)\",\"width\":\(width),\"height\":\(height)}")

default:
    fail("unknown command: \(command)")
}
