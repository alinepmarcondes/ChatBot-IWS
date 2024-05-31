// Chat.test.js
import React from 'react';
import act from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Chat from './Chat';
import { BrowserRouter as Router } from 'react-router-dom';

// Mocking fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ chat: { _id: '1', title: 'Test Chat', content: [] } })
  })
);

describe('Chat Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders Chat component without crashing', async () => {
    await act(async () => {
      render(
        <Router>
          <Chat />
        </Router>
      );
    });

    // Check if initial elements are rendered
    expect(screen.getByPlaceholderText(/Write your question here/i)).toBeInTheDocument();
    expect(screen.getByAltText('Manual')).toBeInTheDocument();
    expect(screen.getByAltText('Add')).toBeInTheDocument();
  });

  test('initial state is correct', async () => {
    await act(async () => {
      render(
        <Router>
          <Chat />
        </Router>
      );
    });

    // Check initial states
    expect(screen.queryByText(/Manual Content/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Starting a new chat/i)).toBeInTheDocument();
  });

  test('opens and closes the manual', async () => {
    await act(async () => {
      render(
        <Router>
          <Chat />
        </Router>
      );
    });

    const manualButton = screen.getByAltText('Manual');
    act(() => {
      fireEvent.click(manualButton);
    });

    // Check if manual opens
    expect(screen.getByText(/Manual Content/i)).toBeInTheDocument(); // Assuming Manual component contains 'Manual Content' text

    const closeButton = screen.getByText(/Close/i); // Assuming Manual component contains a 'Close' button
    act(() => {
      fireEvent.click(closeButton);
    });

    // Check if manual closes
    expect(screen.queryByText(/Manual Content/i)).not.toBeInTheDocument();
  });

  test('adds a new chat', async () => {
    await act(async () => {
      render(
        <Router>
          <Chat />
        </Router>
      );
    });

    const input = screen.getByPlaceholderText(/Write your question here/i);
    act(() => {
      fireEvent.change(input, { target: { value: 'New chat message' } });
    });

    const addButton = screen.getByAltText('Add');
    await act(async () => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/chats', expect.any(Object));
    });

    // Check if new chat is added to the state
    expect(screen.getByText(/Test Chat/i)).toBeInTheDocument();
  });

  test('sends a message', async () => {
    await act(async () => {
      render(
        <Router>
          <Chat />
        </Router>
      );
    });

    const input = screen.getByPlaceholderText(/Write your question here/i);
    act(() => {
      fireEvent.change(input, { target: { value: 'Hello' } });
    });

    const sendButton = screen.getByText(/Send/i);
    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2); // One for adding chat, one for sending message
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/chats/1/content', expect.any(Object));
    });

    // Check if message is added to the current chat
    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
  });

  test('scrolls to bottom when a new message is added', async () => {
    await act(async () => {
      render(
        <Router>
          <Chat />
        </Router>
      );
    });

    const input = screen.getByPlaceholderText(/Write your question here/i);
    act(() => {
      fireEvent.change(input, { target: { value: 'Scrolling message' } });
    });

    const sendButton = screen.getByText(/Send/i);
    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    const messagesEnd = screen.getByText(/Scrolling message/i).nextSibling;
    expect(messagesEnd).toBeInTheDocument();
    expect(messagesEnd.scrollIntoView).toHaveBeenCalled();
  });

  test('sends message on Enter key press', async () => {
    await act(async () => {
      render(
        <Router>
          <Chat />
        </Router>
      );
    });

    const input = screen.getByPlaceholderText(/Write your question here/i);
    act(() => {
      fireEvent.change(input, { target: { value: 'Enter key message' } });
    });

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2); // One for adding chat, one for sending message
      expect(screen.getByText(/Enter key message/i)).toBeInTheDocument();
    });
  });
});
