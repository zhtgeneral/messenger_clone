import AuthSocialButton from '@/app/components/AuthSocialButton';
import type { Meta, StoryObj } from '@storybook/react';

const mockOnClick = () => {};

const meta = {
  title: 'components/AuthSocialButton',
  component: AuthSocialButton,
  args: {
  },
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof AuthSocialButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Github: Story = {
  args: {
    type: "GITHUB",
    onClick: mockOnClick
  }
};
export const Google: Story = {
  args: {
    type: "GOOGLE",
    onClick: mockOnClick
  }
};