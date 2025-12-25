import prompts from 'prompts';

export async function runPrompts(isUpdate) {
  const response = await prompts(
    [
      {
        type: isUpdate ? null : 'text',
        name: 'folderName',
        message: 'Project folder name:',
        initial: 'my-project',
      },
      {
        type: 'multiselect',
        name: 'components',
        message: 'What do you want to set up?',
        choices: [
          {
            title: 'Claude Code commands',
            description: '/write-spec, /develop-feature, /fix-issue, /trace-flow',
            value: 'claude-commands',
            selected: true,
          },
          {
            title: 'GitHub Actions',
            description: 'Doc change notifications, n8n triggers',
            value: 'github-actions',
          },
          {
            title: 'Example feature doc',
            description: 'docs/example-feature/ with spec.md template',
            value: 'example-docs',
            selected: true,
          },
        ],
        hint: '- Space to select. Return to submit',
      },
    ],
    {
      onCancel: () => {
        return false;
      },
    }
  );

  if (!response.components || response.components.length === 0) {
    return null;
  }

  return {
    folderName: response.folderName,
    claudeCommands: response.components.includes('claude-commands'),
    githubActions: response.components.includes('github-actions'),
    exampleDocs: response.components.includes('example-docs'),
  };
}
