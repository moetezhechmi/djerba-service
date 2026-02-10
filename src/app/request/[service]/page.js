
import RequestForm from './form';

export default async function Page({ params }) {
    const { service } = await params;
    return <RequestForm serviceKey={service} />;
}
