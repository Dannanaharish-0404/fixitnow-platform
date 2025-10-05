import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search?category=${service.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="card cursor-pointer transform hover:scale-105 transition-all duration-200"
    >
      <div className="text-center">
        <div className="text-5xl mb-3">{service.icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.name}</h3>
        <p className="text-sm text-gray-600">{service.description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
