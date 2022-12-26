import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const ViewCertificates =()=>{
    let certificatesTable=[];
    let history=useHistory();

    const [certificates,setCertificates]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

    
    const deleteCertificate=(e,id)=>{
        e.preventDefault();
        let isClicked=e.currentTarget;
        isClicked.innerText="..."

        axios.delete(`/api/delete_certificate/${id}`).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                isClicked.closest("tr").remove();
                history.go(0);
            }
            else{
                swal("Error",res.data.message,"error");
                history.go(0);
            }
        });    
    }

    useEffect(()=>{
        axios.get(`/api/view_certificates`).then(res=>{
            if(res.data.status===200)
            {
                setCertificates(res.data.certificates);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        });
    },[]);

    if(error)
    {
        return (
            <div className="container px-4 py-4 text-danger">
                <button onClick={()=>history.goBack()} className="btn btn-sm btn-outline-danger px-4 me-3 mb-3">
                    <i className="fa fa-chevron-left"></i>
                </button>
                <span className="h1 my-4">Something went wrong.</span>
            </div>
        )
    }
    else if(loading)
    {
        return (
            <div className="container px-4 py-4 text-primary">
                <span className="h1 my-4">View Certificates </span>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        certificatesTable=certificates.map((certificate,idx)=>{
            return(
                <tr key={idx}>
                    <td className="py-2 text-center">{certificate.title}</td>
                    <td className="py-2 text-center">
                        <Link className="btn btn-sm btn-dark m-1" to={`/admin/update_certificate/${certificate.id}`} role="button"><i className="fa fa-edit"></i></Link>
                        <span>      </span>
                        <button onClick={(e)=>deleteCertificate(e,certificate.id)} type="button" className="btn btn-sm btn-danger m-1"><i className="fa fa-trash-alt"></i></button>
                    </td>                    
                </tr>
            )
        })
    }

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">View Certificates</h1>
            <i className="my-4 fa fa-pencil-alt fa-3x text-primary d-md-none"></i>

            <div className="table-responsive rounded my-5">
                <table className="table table-bordered bg-light">
                    <tbody>
                        <tr className="bg-dark text-light">
                            <th className="text-center" scope="col">Title</th>
                            <th className="text-center" scope="col"> 
                                <div className="border border-light p-1 px-2 d-inline-block rounded text-light">
                                    <i className="fa fa-arrows-alt-v"></i><span>  {certificates.length}     <Link className="btn btn-sm btn-light" to="/admin/add_certificate" role="button"><i className="fa fa-plus"></i></Link> </span>
                                </div> 
                            </th>
                        </tr>
                        {certificatesTable.reverse()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewCertificates;
