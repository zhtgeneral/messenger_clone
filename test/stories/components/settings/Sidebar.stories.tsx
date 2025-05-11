
import Sidebar from '@/app/components/sidebar/Sidebar';
import SidebarPresenter from '@/app/components/sidebar/SidebarPresenter';
import { User } from '@prisma/client';
import type { Meta, StoryObj } from '@storybook/react';

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

const meta = {
  title: 'components/sidebar/Sidebar',
  component: SidebarPresenter,
  decorators: [
    (Story) => (
      <Story/>
    )
  ],  
  args: {
    user: mockUserCustomPfp
  }
} satisfies Meta<typeof SidebarPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserWithCustomPfp: Story = {};
export const UserWithDefaultPfp: Story = {
  args: {
    user: mockUserDefaultPfp
  }
};

