<template>
  <div class="add">
    <create-or-edit />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateOrEdit from "@/views/advert/components/CreateOrEdit.vue";

export default Vue.extend({
  components: { CreateOrEdit },
  name: "advertAdd"
});
</script>
