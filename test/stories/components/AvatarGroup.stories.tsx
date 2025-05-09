import AvatarGroup from '@/app/components/AvatarGroup';
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
  title: 'components/AvatarGroup',
  component: AvatarGroup,
  args: {
  },
  decorators: [
    (Story) => (
      <Story/>
    )
  ],
  
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoUsers: Story = {
  args: {
    users: []
  }
};
export const OneUserCustomPfp: Story = {
  args: {
    users: [mockUserCustomPfp]
  }
};
export const TwoUsersCustomPfp: Story = {
  args: {
    users: [mockUserCustomPfp, mockUserCustomPfp]
  }
};
export const ThreeUsersCustomPfp: Story = {
  args: {
    users: [mockUserCustomPfp, mockUserCustomPfp, mockUserCustomPfp]
  }
};
export const ThreeUsersDefaultPfp: Story = {
  args: {
    users: [mockUserDefaultPfp, mockUserDefaultPfp, mockUserDefaultPfp]
  }
};
export const MoreThanThreeUsersMixed: Story = {
  args: {
    users: [mockUserDefaultPfp, mockUserCustomPfp, mockUserDefaultPfp, mockUserCustomPfp, mockUserDefaultPfp]
  }
};