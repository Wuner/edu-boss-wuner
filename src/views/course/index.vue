<template>
  <div class="course">
    <course-list />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CourseList from "./components/CourseList.vue";

export default Vue.extend({
  components: { CourseList },
  name: "CourseIndex"
});
</script>
