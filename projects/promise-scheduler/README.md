# Rate-Limited API Client with Advanced Promise Pool

> A Node.js implementation demonstrating rate limiting, concurrency control, and efficient API request management

## 🚀 About

This project implements a sophisticated API client that combines rate limiting and concurrent request handling using a custom promise pool. It's designed to demonstrate how to efficiently manage multiple API requests while respecting rate limits and system resources. The implementation includes a token-bucket rate limiter and an advanced promise pool for controlling concurrency, making it perfect for learning about resource management in Node.js applications.

## ✨ Features

- **Token-Bucket Rate Limiting**: Implements a rate limiter with configurable requests per second using the token-bucket algorithm
- **Concurrency Control**: Advanced promise pool that manages active requests and queues pending ones
- **Batch Request Handling**: Process multiple API requests simultaneously with Promise.allSettled
- **HTTP Method Support**: Built-in support for GET, POST, and extensible for other HTTP methods
- **Real-time Monitoring**: Track pending and running requests with getter methods
- **Error Handling**: Graceful error handling with detailed error messages
- **JSON Response Handling**: Automatic JSON parsing for API responses
- **Configurable Parameters**: Customizable baseURL, rateLimit, and concurrency settings

## 🎯 What You'll Learn

- **Rate Limiting Strategies**: Understanding and implementing token-bucket rate limiting
- **Concurrency Management**: Building a custom promise pool for controlled parallel execution
- **Resource Optimization**: Balancing rate limits with concurrency for optimal performance
- **Node.js Patterns**: Async/await, promises, and event-driven programming in Node.js
- **API Client Design**: Creating flexible and reusable API client architecture
- **Error Handling**: Implementing robust error handling in asynchronous operations

## 💻 How to Use

1. **Install Dependencies**: The code requires Node.js 18+ with native `fetch` support
2. **Create API Client Instance**:

```javascript
const api = new RateLimitedAPIClient({
  baseURL: "https://jsonplaceholder.typicode.com",
  rateLimit: 5, // 5 requests per second
  concurrency: 2, // 2 concurrent requests
});
```

3. Make Single Requests:

```js
const data = await api.get("/posts/1");
const result = await api.post("/posts", { title: "New Post" });
```

4. Batch Process Requests:

```js
const requests = [
  { method: "GET", path: "/posts/1" },
  { method: "GET", path: "/posts/2" },
];
const results = await api.batchRequests(requests);
```

## 🎨 Customization

- **Rate Limit**: Adjust the `rateLimit` parameter to control requests per second
- **Concurrency**: Modify the `concurrency` parameter to control simultaneous requests
- **Base URL**: Change the `baseURL` to work with different APIs
- **Time Window**: Customize the `interval` in `#createRateLimiter`() for different time windows
- **Retry Logic**: Extend the `request` method to implement retry logic for failed requests
- **Authentication**: Add authentication headers in the request method
- **Logging**: Enhance console logs with more detailed information or integrate with logging libraries

## 📁 Project Structure

```text
rate-limited-api-client/
├── main.js    # Main & Demo implementation
└── README.md                     # This file
```

## 📝 License
MIT License - Feel free to use this in your projects, both personal and commercial.