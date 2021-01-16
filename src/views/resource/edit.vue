<template>
  <div class="add">
    <create-or-edit edit />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateOrEdit from "@/views/resource/components/CreateOrEdit.vue";

export default Vue.extend({
  components: { CreateOrEdit },
  name: "resourceEdit",
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
});
</script>
