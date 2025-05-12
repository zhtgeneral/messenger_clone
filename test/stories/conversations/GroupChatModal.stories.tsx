import GroupChatModalPresenter from '@/app/(site)/conversations/components/GroupChatModalPresenter';
import { User } from '@prisma/client';
import type { Meta, StoryObj } from '@storybook/react';

const mockUserCustomPfp: User = {
  name: "test user 1",
  id: "test id",
  email: "test@mail.com",
  emailVerified: new Date(),
  image: "https://res.cloudinary.com/delv2gjka/image/upload/v1746820776/yxrmi9sbb1jo2wel0s39.png",
  hashedPassword: "test hashed password",
  createdAt: new Date(),
  updatedAt: new Date(),
  conversationIds: [],
  seenMessageIds: []
}

const mockUserDefaultPfp: User = {
  name: "test user 2",
  id: "test id",
  email: "test@mail.com",
  emailVerified: new Date(),
  image: null,
  hashedPassword: "test hashed password",
  createdAt: new Date(),
  updatedAt: new Date(),
  conversationIds: [],
  seenMessageIds: []
}

const mockUserDefaultPfp2: User = {
  name: "test user 3",
  id: "test id",
  email: "test@mail.com",
  emailVerified: new Date(),
  image: null,
  hashedPassword: "test hashed password",
  createdAt: new Date(),
  updatedAt: new Date(),
  conversationIds: [],
  seenMessageIds: []
}

const mockUsers = [
  mockUserCustomPfp,
  mockUserDefaultPfp,
  mockUserDefaultPfp2
]

const mockOnClose = () => {}

const meta = {
  title: 'conversations/GroupChatModal',
  component: GroupChatModalPresenter,
  args: {
    isOpen: true,
    onClose: mockOnClose
  },
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof GroupChatModalPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    users: mockUsers,
  }
};
export const IsClosed: Story = {
  args: {
    users: mockUsers,
    isOpen: false
  }
};
export const IsLoading: Story = {
  args: {
    users: mockUsers,
    isLoading: true
  }
};