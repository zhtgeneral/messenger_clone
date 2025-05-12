import Input from '@/app/components/inputs/Input';
import type { Meta, StoryObj } from '@storybook/react';
import { mockErrors, mockRegister } from '../../../.storybook/mocks/MockRegister';

const meta = {
  title: 'components/inputs/input',
  component: Input,
  args: {
    label: "test label",
    id: "test id",
    register: mockRegister,
    errors: mockErrors
  },
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = {
  args: {
    disabled: true
  }
};
export const TypeDate: Story = {
  args: {
    type: 'date'
  }
};
export const TypePassword: Story = {
  args: {
    type: 'password'
  }
};
export const TypeFile: Story = {
  args: {
    type: 'file'
  }
};
export const TypeTime: Story = {
  args: {
    type: 'time'
  }
};
