import LoadingModal from '@/app/components/LoadingModal';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'components/LoadingModal',
  component: LoadingModal,
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof LoadingModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
