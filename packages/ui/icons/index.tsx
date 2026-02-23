import type { SVGProps } from 'react'

const iconProps = (props: SVGProps<SVGSVGElement>) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  ...props,
})

/** Tomato crop icon */
export function TomatoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="8" fill="#e53935" stroke="#c62828" strokeWidth="1" />
      <path d="M12 4c-1 0-2 .5-2.5 1.5" stroke="#8d6e63" strokeWidth="0.5" fill="none" />
    </svg>
  )
}

/** Rice crop icon */
export function RiceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        fill="#8d6e63"
        d="M12 4l-2 4h4l-2-4zm-4 6l2 4h4l2-4h-8zm6 6l-2 4h4l-2-4z"
      />
    </svg>
  )
}

/** Corn crop icon */
export function CornIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path
        fill="#f9a825"
        d="M12 2c-2 0-3 2-3 4v12h6V6c0-2-1-4-3-4z"
      />
      <path fill="#8d6e63" d="M12 18v4h-2v-4h2z" />
    </svg>
  )
}
