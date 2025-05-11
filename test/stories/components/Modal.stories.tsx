
import AuthForm from '@/app/components/AuthForm';
import Modal from '@/app/components/Modal';
import type { Meta, StoryObj } from '@storybook/react';

const onClose = () => {};

const meta = {
  title: 'components/Modal',
  component: Modal,
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  args: {
    onClose: onClose,
    isOpen: true
  }
  
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    isOpen: false
  }
};
export const NoChildren: Story = {};
export const HasSimpleChildren: Story = {
  args: {
    children: "Test children"
  }
};

export const HasComplexChildren: Story = {
  args: {
    children: (
      <AuthForm />
    )
  }
};
