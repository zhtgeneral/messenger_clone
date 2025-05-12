import UserBoxPresenter from '@/app/(site)/users/components/UserBoxPresenter';
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
  title: 'users/UserBox',
  component: UserBoxPresenter,
  args: {
  },
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof UserBoxPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPfp: Story = {
  args: {
    user: mockUserDefaultPfp
  }
};
export const CustomPfp: Story = {
  args: {
    user: mockUserCustomPfp
  }
};
export const Loading: Story = {
  args: {
    user: mockUserCustomPfp,
    isLoading: true
  }
};