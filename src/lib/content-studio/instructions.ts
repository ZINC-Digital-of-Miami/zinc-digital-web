import kirk from '../../../docs/content-studio/voices/kirk.md?raw';
import wendy from '../../../docs/content-studio/voices/wendy.md?raw';
import jaymie from '../../../docs/content-studio/voices/jaymie.md?raw';
import workflow from '../../../docs/content-studio/workflow.md?raw';
import {writingInstructions,analysisInstructions,type Draft} from './model';
const voices={kirk,wendy,jaymie};
export const studioWritingInstructions=(author:Draft['author'])=>writingInstructions(author)+'\n\n'+voices[author]+'\n\n'+workflow;
export const studioAnalysisInstructions=(author:Draft['author'])=>analysisInstructions()+'\n\nAuthor standard for review (do not write the publishable manuscript):\n'+voices[author]+'\n\n'+workflow;
