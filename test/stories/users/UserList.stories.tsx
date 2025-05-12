import Userlist from '@/app/(site)/users/components/Userlist';
import { User } from '@prisma/client';
import type { Meta, StoryObj } from '@storybook/react';

const mockOnClick = () => {};

const mockUserCustomPfp: User = {
  name: "test user",
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
  name: "test user",
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

const mockOtherUser: User = {
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

const mockUsers = [
  mockUserCustomPfp,
  mockUserDefaultPfp,
  mockUserCustomPfp,
  mockOtherUser,
  mockUserDefaultPfp,
  mockOtherUser,
  mockUserCustomPfp,
]

const meta = {
  title: 'users/Userlist',
  component: Userlist,
  args: {
  },
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof Userlist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoUsers: Story = {
  args: {
    users: []
  }
};
export const OneUser: Story = {
  args: {
    users: [mockUserDefaultPfp]
  }
};
export const ManyUsers: Story = {
  args: {
    users: mockUsers
  }
};