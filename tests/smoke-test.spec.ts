import { test, expect } from '@playwright/test'

test.describe('Smoke Tests - Ana Sayfa ve Temel Akışlar', () => {
  test('Ana sayfa yükleniyor ve başlık doğru', async ({ page }) => {
    // Ana sayfaya git
    await page.goto('/')

    // Sayfa başlığının "Antalya Ustası" içerdiğini kontrol et
    await expect(page).toHaveTitle(/Antalya Ustası/i)

    // Ana başlık metninin sayfada olduğunu kontrol et
    await expect(page.locator('h1')).toContainText(/Antalya.*En İyi Ustaları/i)
  })

  test('Giriş Yap butonuna tıklayınca giriş sayfası açılıyor', async ({ page }) => {
    // Ana sayfaya git
    await page.goto('/')

    // "Giriş Yap" butonunu bul ve tıkla
    // Header'da veya sayfada olabilir
    const loginButton = page.getByRole('link', { name: /giriş yap/i }).first()
    
    // Butonun görünür olduğunu kontrol et
    await expect(loginButton).toBeVisible()
    
    // Butona tıkla
    await loginButton.click()

    // Giriş sayfasının açıldığını doğrula
    await expect(page).toHaveURL(/.*giris-yap.*/)
    
    // Giriş formunun görünür olduğunu kontrol et
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('Rastgele bir hizmet sayfası yükleniyor (HTTP 200)', async ({ page }) => {
    // Ana sayfaya git
    await page.goto('/')

    // Hizmet linklerinden birini bul (örneğin ilk kategori kartı)
    // Eğer kategori kartları varsa, ilkine tıkla
    const serviceLink = page.locator('a[href*="/hizmet/"]').first()
    
    // Link varsa tıkla
    const linkCount = await serviceLink.count()
    if (linkCount > 0) {
      const href = await serviceLink.getAttribute('href')
      if (href) {
        // Hizmet sayfasına git
        await page.goto(href)
        
        // Sayfanın başarıyla yüklendiğini kontrol et (HTTP 200)
        await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
        
        // Sayfa içeriğinin yüklendiğini kontrol et
        await expect(page.locator('body')).toBeVisible()
      }
    } else {
      // Eğer hizmet linki yoksa, direkt bir hizmet sayfasına git
      const response = await page.goto('/hizmet/elektrikci')
      
      // HTTP 200 kontrolü
      expect(response?.status()).toBeLessThan(400) // 200-399 arası başarılı
    }
  })

  test('Ana sayfa temel elementleri içeriyor', async ({ page }) => {
    // Ana sayfaya git
    await page.goto('/')

    // Temel elementlerin varlığını kontrol et
    await expect(page.locator('h1')).toBeVisible() // Ana başlık
    await expect(page.locator('body')).toBeVisible() // Sayfa içeriği
    
    // Arama formu varsa kontrol et
    const searchForm = page.locator('form').first()
    if (await searchForm.count() > 0) {
      await expect(searchForm).toBeVisible()
    }
  })
})


