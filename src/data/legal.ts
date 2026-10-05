// Owner-approved Privacy and Terms (PORT.md F4: counsel review). Each section is [heading, paragraph].
// Empty until the owner supplies the reviewed text: the pages then render no legal body (requirement
// R2.6), and launch readiness (task 31.1) requires both filled.
type Legal = { description: string; sections: [string, string][] };
export const privacyApproved: Legal = { description: '', sections: [] };
export const termsApproved: Legal = { description: '', sections: [] };
