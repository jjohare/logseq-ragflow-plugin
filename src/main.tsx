import '@logseq/libs';
import { SettingSchemaDesc, BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import { getBlockContent, formatResponse, convertLogseqLinksToMarkdown } from './utils';

// Define the structure for plugin settings
interface ISettings {
  apiKey: string;
  basePath: string;
}

// No need to maintain a global conversation ID since a new conversation is started for each command

/**
 * Creates a new conversation with the RAGflow service.
 * @param basePath - The base URL of the RAGflow API
 * @param apiKey - The API key for authentication
 * @returns Promise<string> - The ID of the new conversation
 */
async function createConversation(basePath: string, apiKey: string): Promise<string> {
  const response = await fetch(`${basePath}/api/new_conversation`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return data.data.id;
}

/**
 * Sends a message to RAGflow and retrieves the answer.
 * @param basePath - The base URL of the RAGflow API
 * @param apiKey - The API key for authentication
 * @param conversationId - The ID of the current conversation
 * @param message - The message to send (in Markdown format)
 * @returns Promise<string> - The answer from RAGflow
 */
async function getAnswer(basePath: string, apiKey: string, conversationId: string, message: string): Promise<string> {
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
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return data.data.answer;
}

// Define the settings schema for the plugin
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

/**
 * Handles the RAGflow slash command execution.
 * @param uuid - The UUID of the block where the command was invoked
 * @param apiKey - The RAGflow API key
 * @param basePath - The base path for the RAGflow API
 */
async function handleRagflowCommand(uuid: string, apiKey: string, basePath: string) {
  try {
    // Get the block that the command was used on
    const block = await logseq.Editor.getBlock(uuid);
    if (!block) throw new Error('Block not found');

    // Get the content of the block and its children
    const rawContent = await getBlockContent(block as BlockEntity);
    // Convert Logseq-style links to Markdown for better processing by RAGflow
    const markdownContent = convertLogseqLinksToMarkdown(rawContent);

    // Create a new conversation
    const conversationId = await createConversation(basePath, apiKey);

    // Send the content to RAGflow and get the response
    const response = await getAnswer(basePath, apiKey, conversationId, markdownContent);

    // Format the response for insertion into Logseq
    const formattedResponse = formatResponse(response);

    // Update the original block with the response
    await logseq.Editor.updateBlock(uuid, formattedResponse);
  } catch (error) {
    console.error("Error in RAGflow command:", error);
    await logseq.UI.showMsg("Error: " + (error as Error).message, "error");
  }
}

/**
 * Validates the plugin settings.
 * @param settings - The settings object to validate
 * @returns boolean - True if settings are valid, false otherwise
 */
function isValidSettings(settings: unknown): settings is ISettings {
  const s = settings as Partial<ISettings>;
  return typeof s.apiKey === 'string' && s.apiKey.length > 0 &&
         typeof s.basePath === 'string' && s.basePath.length > 0;
}

/**
 * The main function that sets up the plugin.
 */
async function main() {
  const settings = logseq.settings as unknown;

  // Validate settings before proceeding
  if (!isValidSettings(settings)) {
    await logseq.UI.showMsg("Invalid plugin settings. Please check API Key and Base Path.", "error");
    return;
  }

  const { apiKey, basePath } = settings;

  // Register the /ragflow slash command
  logseq.Editor.registerSlashCommand('ragflow', async ({ uuid }) => {
    await handleRagflowCommand(uuid, apiKey, basePath);
  });

  // Reset the conversation if settings change
  logseq.onSettingsChanged(() => {
    main(); // Reinitialize the plugin with new settings
  });
}

// Initialize the plugin
logseq.useSettingsSchema(settings).ready(main).catch(console.error);

