const request = require('supertest');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const app = require('../server');  // Import the exported app

const testScriptPath = path.join(__dirname, 'testdata', 'think_faster.txt');

describe('Generate Audio Route', () => {
  // 确保测试脚本文件存在
  beforeAll(async () => {
    try {
      await fs.access(testScriptPath);
    } catch (error) {
      // 如果文件不存在，创建一个测试脚本
      const testScriptContent = `Emma: Hello, welcome to our audiobook.
Greg: Today we'll discuss how to think faster and more efficiently.
Emma: Let's explore some key strategies for improving cognitive performance.`;
      
      await fs.mkdir(path.dirname(testScriptPath), { recursive: true });
      await fs.writeFile(testScriptPath, testScriptContent);
    }
  });

  // 测试用例：验证 /generate_audio 路由是否能够从脚本生成音频
  it('should generate audio from script text file', async () => {
    const response = await request(app)
      .post('/generate_audio')
      .send({ scriptPath: testScriptPath })
      .timeout(15000)  // Increase timeout
      .expect(200);  // Expect successful response
    
    // 验证返回的是音频类型
    expect(response.headers['content-type']).toMatch(/audio\/mpeg/);
    
    // Save the generated audio to a file
    const audioFilePath = path.join(__dirname, 'output', 'generated_audio.mp3');
    fsSync.writeFileSync(audioFilePath, response.body);
    console.log(`Audio saved to ${audioFilePath}`);

    // 验证返回的音频数据不为空
    expect(response.body).toBeTruthy();
  }, 20000);  // Increase Jest test timeout

  // 测试错误场景：缺少脚本路径
  it('should return 400 if script path is missing', async () => {
    const response = await request(app)
      .post('/generate_audio')
      .send({})
      .expect(400);
  });

  // 测试错误场景：不存在的脚本路径
  it('should return 500 if script path is invalid', async () => {
    const invalidScriptPath = path.join(__dirname, 'testdata', 'non_existent_script.txt');
    
    const response = await request(app)
      .post('/generate_audio')
      .send({ scriptPath: invalidScriptPath })
      .expect(500);
  });
});
