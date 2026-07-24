const fs = require('fs');
const path = require('path');
const fileModel = require('../models/fileModel');
const taskModel = require('../models/taskModel');

const uploadTaskFile = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await taskModel.findTaskById(taskId);
    if (!task) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found',
      });
    }

    if (req.user.role !== 'admin' && task.assigned_to !== req.user.id) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied: Only assignee or admin can upload files to this task',
      });
    }

    const fileRecord = await fileModel.createTaskFile({
      taskId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      file: fileRecord,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

const getTaskFiles = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await taskModel.findTaskById(taskId);
    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found',
      });
    }

    if (req.user.role !== 'admin' && task.assigned_to !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied: Only assignee or admin can view task files',
      });
    }

    const files = await fileModel.getFilesByTaskId(taskId);

    res.status(200).json({
      files,
    });
  } catch (error) {
    next(error);
  }
};

const downloadFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    const fileRecord = await fileModel.findFileById(fileId);
    if (!fileRecord) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'File record not found',
      });
    }

    if (req.user.role !== 'admin' && fileRecord.assigned_to !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied: Only assignee or admin can download this file',
      });
    }

    const absolutePath = path.resolve(fileRecord.file_path);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'File not found on server disk',
      });
    }

    res.download(absolutePath, fileRecord.file_name);
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    const fileRecord = await fileModel.findFileById(fileId);
    if (!fileRecord) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'File record not found',
      });
    }

    await fileModel.deleteFileById(fileId);

    const absolutePath = path.resolve(fileRecord.file_path);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    res.status(200).json({
      message: 'File deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadTaskFile,
  getTaskFiles,
  downloadFile,
  deleteFile,
};
