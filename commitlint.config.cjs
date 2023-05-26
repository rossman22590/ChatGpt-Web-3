module.exports = {
  // Rules of inheritance
  extends: ['@commitlint/config-conventional'],
  // Definition rules type
  rules: {
    // type Type definition, indicating that the Type submitted by Git must be within the following type range
    'type-enum': [
      2,
      'always',
      [
        'feat', // new function feature
        'fix', // repair bug
        'docs', // Documentation comments
        'style', // Code format (changes that do not affect code operation)
        'refactor', // Refactoring (neither adding new features nor fixing bugs)
        'perf', // performance optimization
        'test', // add test
        'chore', // Changes to the build process or accessibility tools
        'revert', // go back
        'build' // Pack
      ]
    ],
    // subject Case does not check
    'subject-case': [0]
  }
}
