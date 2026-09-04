<script setup lang="ts">
  import { useGuest } from '../stores/guestStore'
  import TopBanner from '@/components/Banners/BnrA.vue'
  import InfoBanner from '@/components/Banners/BnrB.vue'
  import GuestBanner from '@/components/Banners/BnrC.vue'
  import UpgradeAccount from '@/components/Banners/BnrD.vue'
  import ScreenShot from '@/components/Banners/BnrE.vue'
  import CoachShot from '@/components/Banners/BnrF.vue'
  const gst = useGuest()
</script>
<template>
    <div class="homePageBanners">
      <UpgradeAccount v-if="gst.guest" />
      <TopBanner />
      <GuestBanner />
      <InfoBanner />
      <ScreenShot />
      <!-- <CoachShot /> -->
    </div>
</template>