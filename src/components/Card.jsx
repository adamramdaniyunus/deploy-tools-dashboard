const Card = ({children}) => {
  return (
    <div className="card glow-effect group relative flex flex-col justify-between overflow-hidden transition-all hover:-translate-y-1">
      {children}
    </div>
  )
}

export default Card