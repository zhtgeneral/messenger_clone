import Button from '@/app/components/Button';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'components/Button',
  component: Button,
  args: {
    children: "test text"
  },
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoChildren: Story = {
  args: {
    children: null
  }
};
export const Default: Story = {};
export const Secondary: Story = {
  args: {
    secondary: true
  }
};
export const Danger: Story = {
  args: {
    danger: true
  }
};
export const Disabled: Story = {
  args: {
    disabled: true
  }
};
export const FullWidth: Story = {
  args: {
    fullWidth: true
  }
};