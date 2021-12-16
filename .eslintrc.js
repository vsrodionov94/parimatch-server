module.exports = {
  extends: [
    'airbnb-base',
  ],
  rules: {
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id', '__v', '_metrics_sessions', '_crash_log', '_security_logs'],
      },
    ],
    'object-shorthand': [2, 'consistent'],
    'arrow-parens': ['error', 'as-needed'],
    'linebreak-style': ['error', 'windows'],
    'no-param-reassign': ['error', { props: false }],
    'quote-props': ['error', 'consistent'],
  },
  env: {
    'es2020': true,
  },
};
