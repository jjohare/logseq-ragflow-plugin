import '@logseq/libs';
import settings, { ISettings } from './settings';
import { getBlockContent } from './utils';

let conversationId = null; // Store the conversation ID here

async function createConversation(basePath: string, apiKey: string) {
  const response = await fetch(`${basePath}/api/new_conversation`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.data.id; // This is the conversation ID.
}

async function getAnswer(basePath: string, apiKey: string, conversationId: string, message: string) {
  const response = await fetch(`${basePath}/api/completion`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      messages: [{ role: 'user', content: message }],
    }),
  });
  const data = await response.json();
  return data.data.answer; // The assistant's reply.
}

async function main() {
  const {
    apiKey,
    basePath,
  } = logseq.settings as unknown as ISettings;

  if (!conversationId) {
    conversationId = await createConversation(basePath, apiKey);
  }

  logseq.Editor.registerSlashCommand('ragflow', async ({ uuid }: { uuid: string }) => {
    const block = await logseq.Editor.getBlock(uuid, { includeChildren: true });
    if (!block) {
      return;
    }

    // Get the content of the block and its children
    const content = await getBlockContent(block);

    // Send the content to RAGFlow and get the response
    const response = await getAnswer(basePath, apiKey, conversationId, content);

    // Insert the response into the block
    await logseq.Editor.insertBlock(uuid, response);
  });

  logseq.onSettingsChanged(() => {
    conversationId = null; // Reset conversation ID if settings change
    main();
  });
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error);
