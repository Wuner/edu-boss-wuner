<template>
  <div class="edit">
    <create-or-edit is-edit />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateOrEdit from "@/views/advert/components/CreateOrEdit.vue";

export default Vue.extend({
  components: { CreateOrEdit },
  name: "advertEdit"
});
</script>
