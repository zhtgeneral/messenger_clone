import LoadingModal from '@/app/components/LoadingModal';
import type { Meta, StoryObj } from '@storybook/react';

// TODO fails
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

export const Normal: Story = {};
