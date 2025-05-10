import EmptyState from '@/app/components/EmptyState';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'components/EmptyState',
  component: EmptyState,
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
