import { useParams } from 'react-router-dom';

const CourseDetails = () => {
  // useParams returns an object of key/value pairs of URL parameters.
  const { id } = useParams();

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">Course Details</h1>
      <p className="mt-4 text-lg text-gray-600">Displaying details for Course ID: <span className="font-bold text-blue-600">{id}</span></p>
    </main>
  );
};

export default CourseDetails;