import React from 'react';

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    description: string;
    targetAmount: number;
    raisedAmount: number;
    endDate: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col space-y-4">
      <h2 className="text-xl font-semibold">{project.name}</h2>
      <p>{project.description}</p>
      <div className="flex justify-between text-gray-600">
        <p>Objectif: {project.targetAmount} tokens</p>
        <p>Collecté: {project.raisedAmount} tokens</p>
      </div>
      <p className="text-gray-500">Fin: {project.endDate}</p>
      <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
        Voter
      </button>
    </div>
  );
};

export default ProjectCard;
