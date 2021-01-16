<template>
  <div class="add">
    <create-or-edit />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateOrEdit from "@/views/menu/components/CreateOrEdit.vue";

export default Vue.extend({
  components: { CreateOrEdit },
  name: "menuAdd",
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
