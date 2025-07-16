export default function Breadcrumb({title,link}) {
    return <div className="overflow-x-auto max-w-fit">
        <div className="breadcrumbs text-sm">
            <ul>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    {console.log(link)}
                    <a href={`/${link}`}>{title}</a>
                </li>
            </ul>
        </div>
    </div>
}