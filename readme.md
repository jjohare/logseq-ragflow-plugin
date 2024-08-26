# Logseq AI Assistant - no code commited post fork as yet

## Features
- Seamless integration with Logseq
- Customizable prompt support
- Easy-to-use built-in prompts 
- Using a custom Open AI basePath

## Install

Make sure you have pnpm installed, install if necessary 🛠
Execute pnpm install 📦
Change the plugin-name in package.json to your liking. Adapt both the package-name and the plugin-id at the bottom of the package.json. Make sure that they are not conflicting with plugins you already installed. 📝
Execute pnpm build to build the plugin 🚧
Enable developer-mode in Logseq, go to plugins, select "Load unpacked plugin" 🔌
Select the directory of your plugin (not the /dist-directory, but the directory which includes your package.json) 📂
Enjoy! 🎉

## Configuration
Before using the plugin, you need to configure it according to your preferences.

- **API Key**: Enter your RAGflow API key.

## How to Use a Custom Prompt

- Open the plugin settings and locate "customPrompts" field.

- Add the following JSON object to the "prompts" array:

```json
{
  "apiKey": "<your-api-key>",
  "model": "gpt-3.5-turbo",
  "customPrompts": {
    "enable": true, // <- Make sure to enable this.
    "prompts": [
      {
        "name": "Markdown Table",
        "prompt": "Please generate a {{text}} Markdown table",
        "output": "replace" // "property", "replace" or "insert"
      }
    ]
  },
  "disabled": false
}
```

- In the Logseq editor, focus the cursor on the place where you want to generate the table and do the following.
![](https://user-images.githubusercontent.com/9718515/226259576-a1193b51-8a57-4cad-9270-f5bc30a5ba29.gif)

## Contribution
Issues and PRs are welcome!

## Licence
MIT
