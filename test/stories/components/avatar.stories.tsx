import Avatar from '@/app/components/Avatar';
import { User } from '@prisma/client';
import type { Meta, StoryObj } from '@storybook/react';

const mockUser: User = {
  name: "test user",
  id: "test id",
  email: "test@mail.com",
  emailVerified: new Date(),
  image: "test image",
  hashedPassword: "test hashed password",
  createdAt: new Date(),
  updatedAt: new Date(),
  conversationIds: [],
  seenMessageIds: []
}

const mockChildren = (
  <div className="h-52 p-6">
    mock
  </div>
)

const meta = {
  title: 'components/Avatar',
  component: Avatar,
  args: {
  },
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoUser: Story = {
  args: {
    user: undefined
  }
};
export const WithUser: Story = {
  args: {
    user: mockUser
  }
};