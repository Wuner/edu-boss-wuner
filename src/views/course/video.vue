<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <div>课程：{{ info.courseName }}</div>
        <div>阶段：{{ info.sectionName }}</div>
        <div>课时：{{ info.lessonName }}</div>
      </div>
      <el-form label-width="40px">
        <el-form-item label="视频">
          <el-upload
            v-loading="isUploading"
            :on-change="handleOnChange"
            :auto-upload="false"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :file-list="videoFile"
          >
            <el-button size="small" type="primary">选择视频</el-button>
          </el-upload>
          <span v-if="videoFile.length === 0 && mediaInfo.fileName">
            {{ mediaInfo.fileName }}
          </span>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
            v-loading="isUploading"
            :on-change="handleOnChangeImg"
            :auto-upload="false"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :file-list="imageFile"
          >
            <el-button size="small" type="primary">选择封面</el-button>
          </el-upload>
          <img
            style="width: 200px"
            v-if="imageFile.length === 0 && mediaInfo.coverImageUrl"
            :src="mediaInfo.coverImageUrl"
            class="avatar"
          />
        </el-form-item>
        <el-form-item v-if="isUploading">
          <el-progress
            type="circle"
            :percentage="percentage"
            :width="178"
            :status="percentage === 100 ? 'success' : undefined"
          />
        </el-form-item>
        <el-form-item v-loading="isUploading">
          <el-button type="primary" @click="authUpload">开始上传</el-button>
          <el-button>返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
import {
  getMediaByLessonId,
  aliyunImagUploadAddressAdnAuth,
  aliyunVideoUploadAddressAdnAuth,
  transCodeVideo,
  getAliyunTransCodePercent
} from "@/services/aliyun-oss";

export default {
  props: {
    courseId: String
  },
  data() {
    return {
      videoFile: [],
      imageFile: [],
      isUploading: false,
      percentage: 0,
      uploader: null,
      videoId: null,
      imageUrl: "",
      fileName: "",
      mediaInfo: {},
      info: {}
    };
  },
  created() {
    this.loadInfo();
    this.initUploader();
  },
  methods: {
    handleOnChange(file) {
      this.videoFile = [file];
    },
    handleOnChangeImg(file) {
      this.imageFile = [file];
    },
    authUpload() {
      const videoFile = this.videoFile[0];
      const imageFile = this.imageFile[0];
      if (imageFile && videoFile) {
        this.uploader.addFile(videoFile.raw, null, null, null, '{"Vod":{}}');
        this.uploader.addFile(imageFile.raw, null, null, null, '{"Vod":{}}');
        this.fileName = videoFile.raw.name;
        this.uploader.startUpload();
      } else {
        this.$message.error("请选择视频和封面");
      }
    },
    initUploader() {
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
        userId: 1618139964448548,
        // 上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
        region: "cn-shanghai",
        // 分片大小默认1M，不能小于100K
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async uploadInfo => {
          console.log("onUploadstarted", uploadInfo);
          let uploadAuthInfo = null;
          if (uploadInfo.isImage) {
            const data = await aliyunImagUploadAddressAdnAuth();
            console.log(data);
            this.imageUrl = data.imageURL;
            uploadAuthInfo = data;
          } else {
            const data = await aliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name
            });
            this.videoId = data.videoId;
            uploadAuthInfo = data;
          }

          // console.log('uploadAuthInfo', uploadAuthInfo)

          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAuthInfo.uploadAuth,
            uploadAuthInfo.uploadAddress,
            uploadAuthInfo.videoId || uploadAuthInfo.imageId
          );
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          console.log("onUploadSucceed", uploadInfo);
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          console.log("onUploadFailed");
        },
        // 文件上传进度，单位：字节
        onUploadProgress: function(uploadInfo, totalSize, loadedPercent) {},
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          console.log("onUploadTokenExpired");
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          console.log(uploadInfo);
          console.log({
            lessonId: this.$route.query.lessonId,
            fileId: this.videoId,
            coverImageUrl: this.imageUrl,
            fileName: this.fileName
          });
          const data = await transCodeVideo({
            lessonId: this.$route.query.lessonId,
            fileId: this.videoId,
            coverImageUrl: this.imageUrl,
            fileName: this.fileName
          });
          console.log(data);
          this.isUploading = true;

          const timer = setInterval(async () => {
            const data = await getAliyunTransCodePercent(
              this.$route.query.lessonId
            );
            this.percentage = data;
            if (data === 100) {
              clearInterval(timer);
              this.isUploading = false;
              this.$router.go(-1);
            }
            console.log("转码进度", data);
          }, 3000);
        }
      });
    },
    async loadInfo() {
      this.mediaInfo = await getMediaByLessonId(this.$route.query.lessonId);
      const { courseName, sectionName, lessonName } = this.$route.query;
      this.info = { courseName, sectionName, lessonName };
      console.log(this.info);
    }
  }
};
</script>
