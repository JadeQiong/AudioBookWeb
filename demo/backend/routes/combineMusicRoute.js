const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { execSync } = require('child_process');

const combineMusicHandler = async (req, res) => {
  try {
    const { audioFiles } = req.body;

    // 参数验证
    if (!audioFiles || !Array.isArray(audioFiles) || audioFiles.length === 0) {
      return res.status(400).json({ 
        error: 'Missing or invalid audio files', 
        details: 'Audio files must be a non-empty array of file paths' 
      });
    }

    // 验证所有音频文件是否存在
    for (const audioFile of audioFiles) {
      try {
        await fs.access(audioFile);
      } catch (error) {
        return res.status(400).json({ 
          error: 'Invalid audio file', 
          details: `File not found: ${audioFile}` 
        });
      }
    }

    const outputDir = path.join(__dirname, '..', 'output');
    await fs.mkdir(outputDir, { recursive: true });

    const combinedPath = path.join(outputDir, 'combined.mp3');
    const finalOutputPath = path.join(outputDir, 'final_podcast.mp3');

    // 合并音频文件
    await combineAudioFiles(audioFiles, combinedPath);

    // 添加结束音乐
    await addEndMusic(combinedPath, finalOutputPath);

    // 发送最终音频文件
    res.setHeader('Content-Type', 'audio/mpeg');
    res.sendFile(finalOutputPath);
  } catch (error) {
    console.error('Music Combination Error:', error);
    res.status(500).json({ 
      error: 'Failed to combine music', 
      details: error.message 
    });
  }
};

// 使用 ffmpeg 合并音频文件的函数
async function combineAudioFiles(inputFiles, outputFile) {
  const listFile = path.join(__dirname, 'filelist.txt');
  const fileListContent = inputFiles.map(filePath => `file '${filePath}'`).join('\n');
  
  try {
    await fs.writeFile(listFile, fileListContent);
    
    const command = `ffmpeg -y -f concat -safe 0 -i ${listFile} -acodec libmp3lame -q:a 2 ${outputFile}`;
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error combining audio files:', error);
    throw error;
  } finally {
    try {
      await fs.unlink(listFile);
    } catch {}
  }
}

// 添加结束音乐的函数
async function addEndMusic(inputFile, outputFile) {
  try {
    const endMusicPath = path.join(__dirname, '..', 'music', 'end_music.mp3');
    
    if (!await fs.access(endMusicPath).then(() => true).catch(() => false)) {
      throw new Error(`End music file not found: ${endMusicPath}`);
    }

    const command = `ffmpeg -y -i ${inputFile} -i ${endMusicPath} -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1[out]" -map "[out]" ${outputFile}`;
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error adding end music:', error);
    throw error;
  }
}

// 路由配置
router.post('/combine_music', combineMusicHandler);

module.exports = router;
module.exports.post = combineMusicHandler;
