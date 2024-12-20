export const progressBarContainer = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
} as const;

export const progressBarSvg = {
  margin: '0 auto',
} as const;

export const progressDotStyle = {
  transition: 'fill 0.3s ease-in-out',
} as const;

export const progressLabelContainer = {
  backgroundColor: 'black',
  color: 'white',
  padding: '8px',
  borderRadius: '5px',
  textAlign: 'center' as const,
  fontSize: '14px',
  transition: 'opacity 0.3s ease-in-out',
};
