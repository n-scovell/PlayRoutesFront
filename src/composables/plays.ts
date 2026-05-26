import { ref, watch, computed, reactive, nextTick  } from 'vue'
import { useAuthStore } from '@/stores/userAuth'
import html2canvas from 'html2canvas' 

const auth = useAuthStore()
const captureArea = ref<HTMLElement | null>(null)
const hideDisplays = ref<boolean>(true)
const saturatePlay = ref<boolean>(false)

export function playBook() {
    const saveScreenshot = async (playName: string, form: string, type: string) => {
        if (!captureArea.value) return
        const canvas = await html2canvas(captureArea.value, {scale: 3})
        canvas.toBlob((blob) => {
            if (!blob) return
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = playName.replaceAll(' ','') + '_' + form + '_' + type + '.png'
            link.click()
        })
    }

    const printPlay = async () => {
        hideDisplays.value = false
        saturatePlay.value = true
        if (!captureArea.value) return
        await nextTick()
        const canvas = await html2canvas(captureArea.value, {
            scale: 1,
            backgroundColor: '#ffffff'
        })
        hideDisplays.value = true
        const image = canvas.toDataURL('image/png')
        const printWindow = window.open('', '_blank')
        if (!printWindow) return
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Play</title>
                    <style>
                        body { margin:20px; display:flex; justify-content:center; align-items:center; }
                        img { width:100%; max-width:1000px; }
                    </style>
                </head>
                <body>
                    <img src="${image}" />
                    <script>
                        window.onload = () => {
                            window.print()
                            window.onafterprint = () => window.close()
                        }
                    <\/script>
                </body>
            </html>
        `)
        printWindow.document.close()
    }
    return { 
        captureArea, 
        hideDisplays,
        saturatePlay,
        saveScreenshot,
        printPlay
    }
}