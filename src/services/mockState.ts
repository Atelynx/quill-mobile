import { demoFriendRequests, demoFriends, demoOrders, demoTrades, demoUser } from '../mocks/demoData';
import type { Friend, FriendRequest, OrderRecord, TradeRecord, UserProfile } from '../types/domain';

interface MockState {
  user: UserProfile;
  orders: OrderRecord[];
  trades: TradeRecord[];
  friends: Friend[];
  requests: FriendRequest[];
}

const cloneUser = (): UserProfile => ({
  ...demoUser,
  watchlist: [...demoUser.watchlist],
});

const createMockState = (): MockState => ({
  user: cloneUser(),
  orders: demoOrders.map((order) => ({ ...order })),
  trades: demoTrades.map((trade) => ({ ...trade })),
  friends: demoFriends.map((friend) => ({ ...friend })),
  requests: demoFriendRequests.map((request) => ({
    ...request,
    from: { ...request.from },
  })),
});

const sharedMockState = createMockState();

export const getMockState = () => sharedMockState;

export const resetMockState = () => {
  const nextState = createMockState();
  sharedMockState.user = nextState.user;
  sharedMockState.orders = nextState.orders;
  sharedMockState.trades = nextState.trades;
  sharedMockState.friends = nextState.friends;
  sharedMockState.requests = nextState.requests;
};
