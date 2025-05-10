import AuthForm from '@/app/components/AuthForm';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'components/AuthForm',
  component: AuthForm,
  args: {
  },
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof AuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotLoggedIn: Story = {
  args: {}
};
