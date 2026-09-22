<script setup lang="ts">
const { data: homepage } = await useHomepage()
const pageRef = ref<HTMLElement | null>(null)
useSectionReveal(pageRef)
</script>

<template>
  <div
    v-if="homepage"
    ref="pageRef"
    class="min-h-dvh bg-background text-left text-foreground"
  >
    <BmNav />

    <main>
      <BmHero
        :title="homepage.heroTitle"
        :emphasis="homepage.heroEmphasis"
        :lead="homepage.heroLead"
        :primary-cta="homepage.heroPrimaryCta"
        :secondary-cta="homepage.heroSecondaryCta"
      />

      <section
        id="what-we-do"
        class="bm-chapter border-t border-border"
      >
        <BmServices :services="homepage.services" />
      </section>

      <section
        id="who-we-are"
        class="bm-chapter bg-secondary text-secondary-foreground"
      >
        <BmAbout
          :title-one="homepage.aboutTitleOne"
          :body-one="homepage.aboutBodyOne"
          :title-two="homepage.aboutTitleTwo"
          :body-two="homepage.aboutBodyTwo"
        />
      </section>

      <section
        id="how-we-work"
        class="bm-chapter border-t border-border"
      >
        <BmProcess :steps="homepage.processSteps" />
      </section>

      <section
        id="contact"
        class="bm-chapter border-t border-border"
      >
        <BmContact
          :title="homepage.contactTitle"
          :body="homepage.contactBody"
          :email="homepage.contactEmail"
          :why-title="homepage.whyTitle"
          :why-body="homepage.whyBody"
        />
      </section>
    </main>

    <BmFooter
      :email="homepage.contactEmail"
      :location="homepage.contactLocation"
    />
  </div>
</template>
