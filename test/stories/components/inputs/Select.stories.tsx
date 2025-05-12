import Select from '@/app/components/inputs/Select';
import type { Meta, StoryObj } from '@storybook/react';

const mockOnChange = (value: Record<string, any>) => {
  mockValue.concat(value);
};

let mockOptions = [
  {
    value: "mock value 1",
    label: "mock label 1"
  },
  {
    value: "mock value 2",
    label: "mock label 2"
  },
  {
    value: "mock value 3",
    label: "mock label 3"
  },
]
let mockValue: Record<string, any>[] = [];
  
const meta = {
  title: 'components/inputs/select',
  component: Select,
  args: {
    label: "test label",
    onChange: mockOnChange,
    options: mockOptions,
    value: mockValue
  },
  decorators: [
    (Story) => (
      <Story />
    ) 
  ],
  
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoOptions: Story = {
  args: {
    options: []
  }
};
export const HasOptions: Story = {};
export const HasSelected: Story = {
  args: {
    value: [
      {
        value: "mock value 2",
        label: "mock label 2"
      },
    ]
  }
};
export const HasManySelected: Story = {
  args: {
    value: [
      {
        value: "mock value 1",
        label: "mock label 1"
      },
      {
        value: "mock value 2",
        label: "mock label 2"
      },
    ]
  }
};
export const AllSelected: Story = {
  args: {
    value: [
      {
        value: "mock value 1",
        label: "mock label 1"
      },
      {
        value: "mock value 2",
        label: "mock label 2"
      },
      {
        value: "mock value 3",
        label: "mock label 3"
      },
    ]
  }
};