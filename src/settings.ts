import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
import { IPrompt } from './prompts/type';

export interface ISettings {
  apiKey: string;
  basePath: string;
  model: string;
  tag: string;
  customPrompts: {
    enable: boolean;
    prompts: IPrompt[];
  };
}

const settings: SettingSchemaDesc[] = [
  {
    key: 'apiKey',
    type: 'string',
    title: 'API Key',
    description: 'Enter your RAGflow API key.',
    default: '',
  },
  {
    key: 'basePath',
    type: 'string',
    title: 'RAGFlow basePath',
    description: 'Enter your openApi proxy basePath',
    default: 'http://localhost/v1',
  },
];

export default settings;
