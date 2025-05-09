import type { Preview } from '@storybook/react'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import "tailwindcss/tailwind.css";
import AuthContext from '../../app/context/AuthContext';
import mockRouterContext from './mocks/MockRouterContext';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      /** This context gives access to a mock router */
      <AppRouterContext.Provider value={mockRouterContext}>
        <Story />
      </AppRouterContext.Provider>
    ),
    (Story) => (
      /** This context gives access to useUser hook */
      <AuthContext>
        <Story />
      </AuthContext>  
    ),
  ]
};

export default preview;