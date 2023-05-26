import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ChatGptConfig } from '@/types';

export interface ConfigState {
  // Configuration information
  config: ChatGptConfig;
  // Model
  models: Array<{
    label: string;
    value: string;
  }>;
  // Configure pop -up switch
  configModal: boolean;
  // Modify the configuration pop -up window
  setConfigModal: (value: boolean) => void;
  // Change setting
  changeConfig: (config: ChatGptConfig) => void;
}

const configStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      configModal: false,
      models: [
        {
          label: 'GPT-3.5',
          value: 'gpt-3.5-turbo',
        },
        {
          label: 'GPT-4',
          value: 'gpt-4',
        },
        // {
        //   label: 'GPT-4-0314',
        //   value: 'gpt-4-0314'
        // },
        // {
        //   label: 'GPT-4-32k',
        //   value: 'gpt-4-32k'
        // },
        // {
        //   label: 'TEXT-002',
        //   value: 'text-davinci-002'
        // },
        // {
        //   label: 'TEXT-003',
        //   value: 'text-davinci-003'
        // },
        // {
        //   label: 'CODE-002',
        //   value: 'code-davinci-002'
        // }
      ],
      config: {
        model: 'gpt-3.5-turbo',
        temperature: 0,
        presence_penalty: 0,
        frequency_penalty: 0,
        // limit_message: 4,
        max_tokens: 2000,
        // api: 'https://api.openai.com',
        // api_key: '',
      },
      setConfigModal: (value) => set({ configModal: value }),
      changeConfig: (config) =>
        set((state: ConfigState) => ({
          config: { ...state.config, ...config },
        })),
    }),
    {
      name: 'config_storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
    }
  )
);

export default configStore;
