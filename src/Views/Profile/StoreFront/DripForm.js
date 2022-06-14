import { Dialog, DialogContent, DialogActions, Button, TextField, FormControlLabel } from '@mui/material'
import { useState,useRef,useEffect } from 'react'
import NumericInput from 'react-numeric-input'
import { firestore,storage } from '../../../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { uploadBytesResumable,ref, getDownloadURL } from 'firebase/storage'
import UploadBar from '../../Upload/uploadbar'
import TermsAndConditions from '../../TermsAndConditions/TermsAndConditions'

const DripForm = ({open,setOpen,selectedDrip = null,mode = "add",user}) => {
    const [productTitle,setProductTitle] = useState('')
    const [productDescription,setProductDescription] = useState('')
    const [productPrice,setProductPrice] = useState(0)
    const productImageFileInput = useRef()
    const [productImagePath,setProductImagePath] = useState(null)
    const [productImageUrl,setProductImageUrl] = useState(null)
    const [uploading,setUploading] = useState(false)
    const [uploadPercentage,setPercentUpload] = useState(0)
    const [showTerms,setShowTerms] = useState(false)
    const [agreedToTerms,setAgreedToTerms] = useState(false)

    useEffect(()=>{
        if(selectedDrip){
            setProductTitle(selectedDrip.title)
            setProductDescription(selectedDrip.description)
            setProductPrice(selectedDrip.price)
            setProductImageUrl(selectedDrip.imageUrl)
            setProductImagePath(selectedDrip.imagePath)
        }
    },[selectedDrip,setProductTitle,setProductDescription,setProductPrice,setProductImageUrl,setProductImagePath])

    const getProductImageData = async () => {
        return new Promise(async (resolve,reject)=>{
            const productImageData = await uploadProductImage()
            if(productImageData !== undefined){
                if(productImageData.imageUrl !== null && productImageData.imagePath !== null){
                    console.log("Resolving getProductImageData promise")
                    resolve({
                        imageUrl : productImageData.imageUrl,
                        imagePath : productImageData.imagePath
                    })
                }else reject(false)
            }else{
                console.log("Image data was undefined")
                reject(false)
            }
        })
    }

    const uploadProductImage = async () => {
        if(productImageFileInput.current.files[0] === null || productImageFileInput.current.files[0] === undefined){
            alert("Please select an image for your drip.")
            return
        }

        if(!agreedToTerms){
            alert("You must agree to our Terms and Conditions before uploading music to the platform.")
            return
        }
        
        try{
            const imageUploadPath = "/" + user.uid + "/product_images/" + productImageFileInput.current.files[0].name
            const uploadRef = ref(storage,imageUploadPath)
            const uploadTask = uploadBytesResumable(uploadRef, productImageFileInput.current.files[0])
            return new Promise((resolve,reject)=>{
                uploadTask.on('state_changed', 
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        setPercentUpload(parseInt(progress.toFixed(2)))
                        switch (snapshot.state) {
                            case 'paused':
                                break;
                            case 'running':
                                setUploading(true)
                                break;
                        }
                    }, 
                    (error) => {
                        console.error(error)
                        setPercentUpload(0)
                        reject("Error while uploading drip image")
                    }, 
                    async () => {
                        setPercentUpload(0) //Reset the upload bar
                        let downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                        setUploading(false) //Set uploading to false
                        resolve({
                            imageUrl : downloadURL,
                            imagePath : imageUploadPath
                        })
                    }
                )
            })
        }catch(err){
            console.error(err)
        }
    }

    const clearDripForm = () => {
        setProductTitle('')
        setProductDescription('')
        setProductPrice(0)
        setProductImageUrl(null)
        setProductImagePath(null)
        setUploading(false)
        setPercentUpload(0)
    }

    const checkInput = () => {
        let errs = []

        if(productTitle === null || productTitle.length < 3){ //If the title has less than 3 chars or it's null
            errs.push("Please enter a title for your drip. Make sure the title is at least 3 characters long.")
        }

        if(productDescription === null || productDescription.length < 10){
            errs.push("Please enter a description for your drip. Make sure the description is at least 10 characters long.")
        }

        if(productPrice === 0 || productPrice === null || productPrice === undefined){
            errs.push("Please enter a price for your drip. It must be at least 1 dollar.")
        }

        if(errs.length === 0){
            return true
        }else{
            let msg = ''
            for(let i = 0 ; i < errs.length; i++){
                msg += '\n' + errs[i]
            }
            alert(msg)
            return false
        }
    }

    const saveDrip = async () => {
        if(selectedDrip && mode === 'edit'){ //We are in U mode

        }else if(!selectedDrip && mode === 'add' && checkInput()){ //We are in C mode
            const productImageData = await getProductImageData()
            console.log("Retrieved product image data")
            console.log(productImageData)
            if(productImageData){
                const newDripTemplate = {
                    title : productTitle,
                    description : productDescription,
                    price : productPrice,
                    imageUrl : productImageData.imageUrl,
                    imagePath : productImageData.imagePath
                }

                console.log("Saving product template")
                console.log(newDripTemplate)
                const dripCollectionRef = collection(firestore,'/users/' + user.uid + '/drip')
                try{
                    await addDoc(dripCollectionRef,newDripTemplate)
                    clearDripForm()
                    alert("Your drip has been added to your drip store.")
                    setOpen(false)
                }catch(err){
                    console.error(err)
                }
            }
        }
    }

    return <Dialog open={open} onClose={e=>setOpen(false)}>
        <DialogContent>
            <div className="add_drip">
                <h5>Add New Product</h5>
                {mode !== 'edit' && <FormControlLabel  control={<input type="file" accept="jpg,png" ref={productImageFileInput}/>} label="Product Image"></FormControlLabel>}
                {mode === 'edit' && <img src={productImageUrl} width="100%" height="auto"/>}
                <br/>
                <TextField fullWidth label="Product Title" placeholder="Product Title" value={productTitle} onChange={e=>setProductTitle(e.target.value)}/>
                <br/>
                <TextField fullWidth label="Product Description" multiline={true} rows={5} placeholder="Product Description" value={productDescription} onChange={e=>setProductDescription(e.target.value)}/>
                <br/>
                Product Price: $<NumericInput min={1} style={{width: '100%'}} value={productPrice} onChange={e=>setProductPrice(e)}/>
                <br/><br/>
                <div style={{display: 'grid', gridTemplateColumns : '1fr 11fr', maxWidth : 'fit-content', alignSelf: 'center'}}>
                    <input name="agreee" type="checkbox" checked={agreedToTerms} onChange={e=>setAgreedToTerms(e.target.checked)}></input>
                    <label htmlFor="agreee">I agree to the <span onClick={e=>setShowTerms(true)} className="terms_and_conditions_link">Terms and Conditions</span></label>
                    <TermsAndConditions open={showTerms} setOpen={setShowTerms}/>
                </div>
                {uploading && <UploadBar percent={uploadPercentage}/>}
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={e=>setOpen(false)}>Cancel</Button>
            {mode === 'add' && <Button onClick={saveDrip}>Add Product</Button>}
            {mode === 'edit' && <Button onClick={saveDrip}>Update Product</Button>}
        </DialogActions>
    </Dialog>
}

export default DripForm