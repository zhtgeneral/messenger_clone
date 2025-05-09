import AuthForm from '@/app/components/AuthForm';
import { User } from '@prisma/client';
import type { Meta, StoryObj } from '@storybook/react';

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

const meta = {
  title: 'components/AuthForm',
  component: AuthForm,
  args: {
  },
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof AuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoUsers: Story = {
  args: {}
};
