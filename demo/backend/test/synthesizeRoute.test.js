const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = require('../server');  // Import the exported app

// 创建一个测试用的 Express 应用
// const app = express();
// app.use(express.json());

// 打印路由信息
// console.log('Synthesize Route:', synthesizeRoute);

// 添加详细的日志中间件
// app.use((req, res, next) => {
//   console.log('Request URL:', req.url);
//   console.log('Request Method:', req.method);
//   console.log('Request Headers:', req.headers);
//   console.log('Request Body:', req.body);

//   // 捕获响应的详细信息
//   const oldWrite = res.write;
//   const oldEnd = res.end;
//   const chunks = [];

//   res.write = function(chunk) {
//     chunks.push(chunk);
//     return oldWrite.apply(res, arguments);
//   };

//   res.end = function(chunk) {
//     if (chunk) chunks.push(chunk);
//     const body = Buffer.concat(chunks);
//     console.log('Response Body:', body.toString());
//     return oldEnd.apply(res, arguments);
//   };

//   next();
// });

// app.use('/synthesize', synthesizeRoute);

// 添加错误处理中间件
// app.use((err, req, res, next) => {
//   console.error('Unhandled Error:', err);
//   res.status(500).json({ error: 'Internal Server Error', details: err.message });
// });

const testScriptPath = path.join(__dirname, 'testdata', 'think_faster.txt');

describe('Synthesize Route', () => {
  let chunks = [];
  let oldEnd;

  beforeEach(() => {
    chunks = [];
    oldEnd = undefined;
  });

  // Capture response chunks for detailed logging
  function captureResponse(res) {
    oldEnd = res.end;
    res.end = function(chunk) {
      if (chunk) chunks.push(chunk);
      const body = Buffer.concat(chunks);
      console.log('Response Body:', body.toString());
      return oldEnd.apply(res, arguments);
    };
    return res;
  }

  jest.setTimeout(60000);

  // Test case: Verify /synthesize route can generate audio
  it('should generate audio from book script', async () => {
    const response = await request(app)
      .post('/synthesize')
      .send({ text: 'Sample Book Title', author: 'Sample Author' })
      .timeout(30000)  // Increase timeout
      .expect(200);

    // 验证返回的是音频类型
    expect(response.headers['content-type']).toMatch(/audio\/mpeg/);
  })

  // Test error scenario: Missing required parameters
  it('should return 400 if book title or author is missing', async () => {
    const response = await request(app)
      .post('/synthesize')
      .send({})
      .expect(400);
  });
});
